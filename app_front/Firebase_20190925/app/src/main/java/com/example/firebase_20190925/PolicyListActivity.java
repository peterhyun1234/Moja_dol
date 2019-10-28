package com.example.firebase_20190925;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class PolicyListActivity extends AppCompatActivity {

    TextView tv_userEmail;
    Button btn_policy1, btn_policy2, btn_policy3, btn_logout;
    Button serverButton;
    Button btn_testButton;
    Button realServerButton;
    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_policy_list);

        sharedPreferences = getSharedPreferences("session",MODE_PRIVATE);
        String userEmail = sharedPreferences.getString("userEmail", "null");

        tv_userEmail = findViewById(R.id.tv_currentUserEmail);
        btn_policy1 = findViewById(R.id.btn_policy1);
        btn_policy2 = findViewById(R.id.btn_policy2);
        btn_policy3 = findViewById(R.id.btn_policy3);
        btn_logout = findViewById(R.id.btn_logout);
        btn_testButton=findViewById(R.id.testButton);
        realServerButton=findViewById(R.id.realServerButton);


        tv_userEmail.setText(userEmail);

        btn_policy1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(PolicyListActivity.this, PolicyDetailActivity.class);
                intent.putExtra("policyCode",1);
                startActivity(intent);
            }
        });

        btn_policy2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(PolicyListActivity.this, PolicyDetailActivity.class);
                intent.putExtra("policyCode",2);
                startActivity(intent);
            }
        });

        btn_policy3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(PolicyListActivity.this, PolicyDetailActivity.class);
                intent.putExtra("policyCode",3);
                startActivity(intent);
            }
        });

        btn_logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sharedPreferences.edit().clear().apply();
                Intent intent = new Intent(PolicyListActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
        btn_testButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(PolicyListActivity.this,TestActivity.class);
                startActivity(intent);
            }
        });
        realServerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(PolicyListActivity.this,testServerActivity.class);
                startActivity(intent);
            }
        });

    }



}
